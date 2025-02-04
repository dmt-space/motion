import * as React from "react"
import { motion } from "../../"
import { render } from "@testing-library/react"
import { MockDrag, drag } from "../../behaviours/__tests__/utils"
import sync from "framesync"

describe("pan", () => {
    test("pan handlers aren't frozen at pan session start", async () => {
        const promise = new Promise(resolve => {
            let count = 0
            const Component = () => {
                const [increment, setIncrement] = React.useState(1)
                return (
                    <MockDrag>
                        <motion.div
                            onPanStart={() => {
                                count += increment
                                setIncrement(2)
                            }}
                            onPan={() => (count += increment)}
                            onPanEnd={() => {
                                count += increment
                                resolve(count)
                            }}
                        />
                    </MockDrag>
                )
            }

            const { container, rerender } = render(<Component />)
            rerender(<Component />)

            const pointer = drag(container.firstChild).to(100, 100)

            sync.postRender(() => {
                pointer.to(50, 50)
                sync.postRender(() => {
                    pointer.end()
                })
            })
        })

        return expect(promise).resolves.toBe(7)
    })
})
